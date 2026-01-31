import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2, Truck, CheckCircle } from 'lucide-react';
import { useDelivery } from '@/hooks/useDelivery';
import { useAuth } from '@/hooks/useAuth';

export default function DeliveryAddressInput() {
  const { profile } = useAuth();
  const { deliveryInfo, isCalculating, calculateDelivery, clearDelivery } = useDelivery();
  const [address, setAddress] = useState(profile?.area || '');

  const handleCalculate = async () => {
    if (address.trim()) {
      await calculateDelivery(address.trim());
    }
  };

  const handleClear = () => {
    clearDelivery();
    setAddress('');
  };

  if (deliveryInfo) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Delivery Address Set</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Change
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {deliveryInfo.destinationAddress}
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{deliveryInfo.distanceText}</span>
              <span className="text-muted-foreground">•</span>
              <span>{deliveryInfo.durationText}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-background rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="font-medium">Delivery Charge</span>
            </div>
            <span className={`font-bold text-lg ${deliveryInfo.charge === 0 ? 'text-green-600' : 'text-foreground'}`}>
              {deliveryInfo.charge === 0 ? 'FREE' : `₹${deliveryInfo.charge}`}
            </span>
          </div>
          
          {deliveryInfo.charge === 0 && (
            <p className="text-xs text-green-600 text-center">
              You're within 3km - Free delivery zone!
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Label htmlFor="delivery-address" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Delivery Address
        </Label>
        
        <div className="space-y-2">
          <Input
            id="delivery-address"
            placeholder="Enter your full address (e.g., Wakad, Pune)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
          />
          
          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating || !address.trim()}
            className="w-full"
            variant="outline"
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Truck className="mr-2 h-4 w-4" />
                Calculate Delivery Charge
              </>
            )}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Free delivery within 3km of Urban Forest, Mamurdi
        </p>
      </CardContent>
    </Card>
  );
}
