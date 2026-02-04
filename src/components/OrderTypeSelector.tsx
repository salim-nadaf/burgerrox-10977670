import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Truck } from 'lucide-react';

export type OrderType = 'pickup' | 'delivery';

interface OrderTypeSelectorProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
}

const RESTAURANT_ADDRESS = "Urban Forest, Mamurdi, Saint Tukaram Nagar Road, Kiwale, Pune 412101";

export default function OrderTypeSelector({ value, onChange }: OrderTypeSelectorProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-semibold mb-3">Order Type</h4>
        <RadioGroup value={value} onValueChange={(v) => onChange(v as OrderType)} className="gap-3">
          <div 
            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
              value === 'pickup' ? 'border-primary bg-primary/5' : 'hover:bg-accent'
            }`}
            onClick={() => onChange('pickup')}
          >
            <RadioGroupItem value="pickup" id="pickup" />
            <Label htmlFor="pickup" className="flex items-center space-x-3 cursor-pointer flex-1">
              <Store className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium">Pickup</p>
                <p className="text-xs text-muted-foreground">Collect from restaurant</p>
              </div>
            </Label>
          </div>
          
          <div 
            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
              value === 'delivery' ? 'border-primary bg-primary/5' : 'hover:bg-accent'
            }`}
            onClick={() => onChange('delivery')}
          >
            <RadioGroupItem value="delivery" id="delivery" />
            <Label htmlFor="delivery" className="flex items-center space-x-3 cursor-pointer flex-1">
              <Truck className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-xs text-muted-foreground">Free within 3km • Max 12km</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
        
        {value === 'pickup' && (
          <div className="mt-3 p-3 bg-accent/50 rounded-lg border border-border">
            <p className="text-sm font-medium flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              Pickup Location
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {RESTAURANT_ADDRESS}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { RESTAURANT_ADDRESS };
