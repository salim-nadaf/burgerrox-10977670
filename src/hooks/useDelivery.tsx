import { useState, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface DeliveryInfo {
  address: string;
  distanceKm: number;
  distanceText: string;
  durationText: string;
  charge: number;
  label: string;
  destinationAddress: string;
}

interface DeliveryContextType {
  deliveryInfo: DeliveryInfo | null;
  isCalculating: boolean;
  calculateDelivery: (address: string) => Promise<DeliveryInfo | null>;
  clearDelivery: () => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateDelivery = async (address: string): Promise<DeliveryInfo | null> => {
    if (!address || address.trim().length < 5) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid delivery address",
        variant: "destructive"
      });
      return null;
    }

    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-delivery', {
        body: { customerAddress: address }
      });

      if (error) {
        throw new Error(error.message || 'Failed to calculate delivery');
      }

      if (data.error) {
        toast({
          title: "Address Error",
          description: data.error,
          variant: "destructive"
        });
        return null;
      }

      const info: DeliveryInfo = {
        address: address,
        distanceKm: data.distance.value,
        distanceText: data.distance.text,
        durationText: data.duration.text,
        charge: data.deliveryCharge,
        label: data.deliveryLabel,
        destinationAddress: data.destinationAddress
      };

      setDeliveryInfo(info);
      
      if (info.charge === 0) {
        toast({
          title: "Free Delivery!",
          description: `You're within 3km - delivery is FREE! (${info.distanceText})`,
        });
      } else {
        toast({
          title: "Delivery Calculated",
          description: `Distance: ${info.distanceText} - Delivery charge: ₹${info.charge}`,
        });
      }

      return info;
    } catch (error: any) {
      console.error('Error calculating delivery:', error);
      toast({
        title: "Calculation Error",
        description: error.message || "Failed to calculate delivery charge. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  const clearDelivery = () => {
    setDeliveryInfo(null);
  };

  return (
    <DeliveryContext.Provider value={{
      deliveryInfo,
      isCalculating,
      calculateDelivery,
      clearDelivery
    }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}
