import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Building2, MapPin, Hash } from 'lucide-react';

export interface DetailedAddress {
  flatNo: string;
  building: string;
  area: string;
  pincode: string;
}

interface DetailedAddressFormProps {
  value: DetailedAddress;
  onChange: (address: DetailedAddress) => void;
  locationAddress?: string; // From Google Places
}

export function isAddressComplete(address: DetailedAddress): boolean {
  return !!(
    address.flatNo.trim() &&
    address.building.trim() &&
    address.area.trim() &&
    address.pincode.trim() &&
    /^\d{6}$/.test(address.pincode.trim())
  );
}

export function formatFullAddress(address: DetailedAddress, locationAddress?: string): string {
  const parts = [
    address.flatNo,
    address.building,
    address.area,
    address.pincode
  ].filter(Boolean);
  
  const detailedPart = parts.join(', ');
  
  if (locationAddress) {
    return `${detailedPart} (Near: ${locationAddress})`;
  }
  
  return detailedPart;
}

export default function DetailedAddressForm({ value, onChange, locationAddress }: DetailedAddressFormProps) {
  const handleChange = (field: keyof DetailedAddress, val: string) => {
    onChange({ ...value, [field]: val });
  };

  const isPincodeValid = !value.pincode || /^\d{0,6}$/.test(value.pincode);

  return (
    <Card className="border-dashed">
      <CardContent className="p-4 space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          Delivery Address Details
        </h4>
        
        {locationAddress && (
          <p className="text-xs text-muted-foreground bg-accent/50 p-2 rounded">
            📍 Location: {locationAddress}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="flatNo" className="text-xs flex items-center gap-1">
              <Hash className="h-3 w-3" />
              House / Flat No. *
            </Label>
            <Input
              id="flatNo"
              value={value.flatNo}
              onChange={(e) => handleChange('flatNo', e.target.value)}
              placeholder="e.g., A-101"
              className="h-9"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="pincode" className="text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Pincode *
            </Label>
            <Input
              id="pincode"
              value={value.pincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                handleChange('pincode', val);
              }}
              placeholder="e.g., 412101"
              className={`h-9 ${!isPincodeValid ? 'border-destructive' : ''}`}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="building" className="text-xs flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            Building / Society Name *
          </Label>
          <Input
            id="building"
            value={value.building}
            onChange={(e) => handleChange('building', e.target.value)}
            placeholder="e.g., Green Valley Apartments"
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="area" className="text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Area / Locality *
          </Label>
          <Input
            id="area"
            value={value.area}
            onChange={(e) => handleChange('area', e.target.value)}
            placeholder="e.g., Wakad, Hinjewadi"
            className="h-9"
          />
        </div>

        {!isAddressComplete(value) && (
          <p className="text-xs text-amber-600">
            All fields are required for delivery
          </p>
        )}
      </CardContent>
    </Card>
  );
}
