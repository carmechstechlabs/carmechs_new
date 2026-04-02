
import React, { useEffect, useRef } from 'react';
import { Input } from './ui/input';

interface AddressInputProps {
  value: string;
  onChange: (value: string, location?: { lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const AddressInput: React.FC<AddressInputProps> = ({ value, onChange, placeholder, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (window.google && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'IN' } // Default to India as per previous context
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place.formatted_address) {
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();
          onChange(place.formatted_address, lat && lng ? { lat, lng } : undefined);
        }
      });
    }
  }, [onChange]);

  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Enter your address"}
      className={className}
    />
  );
};

export default AddressInput;
