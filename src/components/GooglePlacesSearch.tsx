import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GooglePlacesSearchProps {
  onPlaceSelect: (place: {
    placeId: string;
    formattedAddress: string;
    shortAddress: string;
    lat: number;
    lng: number;
  }) => void;
  placeholder?: string;
  disabled?: boolean;
  apiKey: string;
}

interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
}

// Script loading state
let scriptLoadPromise: Promise<void> | null = null;
let isScriptLoaded = false;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (isScriptLoaded && window.google?.maps?.places) {
    return Promise.resolve();
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.maps?.places) {
      isScriptLoaded = true;
      resolve();
      return;
    }

    // Check for existing script
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        isScriptLoaded = true;
        resolve();
      });
      existingScript.addEventListener('error', reject);
      return;
    }

    // Create new script
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&region=IN&language=en`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isScriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

export default function GooglePlacesSearch({ 
  onPlaceSelect, 
  placeholder = "Search for your delivery location...",
  disabled = false,
  apiKey
}: GooglePlacesSearchProps) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const placesContainerRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await loadGoogleMapsScript(apiKey);
        
        if (!mounted) return;

        // Create services
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        
        // Create hidden div for PlacesService
        if (!placesContainerRef.current) {
          placesContainerRef.current = document.createElement('div');
        }
        placesServiceRef.current = new google.maps.places.PlacesService(placesContainerRef.current);
        
        // Create session token
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        
        setIsReady(true);
        setError(null);
      } catch (err) {
        console.error('[GooglePlaces] Init error:', err);
        if (mounted) {
          setError('Failed to load Google Maps. Please refresh.');
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [apiKey]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search function
  const searchPlaces = useCallback(async (input: string) => {
    if (input.length < 3) {
      setPredictions([]);
      setShowResults(false);
      return;
    }

    if (!isReady || !autocompleteServiceRef.current) {
      setError('Google Maps is loading...');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input,
        componentRestrictions: { country: 'in' },
        location: new google.maps.LatLng(18.5204, 73.8567), // Pune center
        radius: 50000,
      };

      if (sessionTokenRef.current) {
        request.sessionToken = sessionTokenRef.current;
      }

      autocompleteServiceRef.current.getPlacePredictions(
        request,
        (results, status) => {
          setIsSearching(false);

          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const formatted: PlacePrediction[] = results.map((p) => ({
              placeId: p.place_id,
              mainText: p.structured_formatting?.main_text || p.description.split(',')[0],
              secondaryText: p.structured_formatting?.secondary_text || p.description,
              fullText: p.description,
            }));
            setPredictions(formatted);
            setShowResults(true);
          } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setPredictions([]);
            setShowResults(true);
          } else {
            console.error('[GooglePlaces] Search error:', status);
            setError(`Search failed: ${status}`);
            setPredictions([]);
            setShowResults(true);
          }
        }
      );
    } catch (err: any) {
      setIsSearching(false);
      setError(err.message || 'Search failed');
      setPredictions([]);
      setShowResults(true);
    }
  }, [isReady]);

  // Debounced search on query change
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 3) {
      setPredictions([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchPlaces(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchPlaces]);

  // Handle place selection
  const handleSelect = useCallback((prediction: PlacePrediction) => {
    if (!placesServiceRef.current) {
      setError('Places service not ready');
      return;
    }

    placesServiceRef.current.getDetails(
      {
        placeId: prediction.placeId,
        fields: ['place_id', 'name', 'formatted_address', 'geometry'],
        sessionToken: sessionTokenRef.current || undefined,
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          onPlaceSelect({
            placeId: place.place_id || prediction.placeId,
            formattedAddress: place.formatted_address || prediction.fullText,
            shortAddress: place.name || prediction.mainText,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });

          setQuery(place.name || prediction.mainText);
          setShowResults(false);
          setPredictions([]);

          // New session token for next search
          sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        } else {
          setError(`Failed to get place details: ${status}`);
        }
      }
    );
  }, [onPlaceSelect]);

  const clearSearch = () => {
    setQuery('');
    setPredictions([]);
    setShowResults(false);
    setError(null);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => predictions.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-9 pr-9 bg-background"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isSearching && (
          <Loader2
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground",
              query ? "right-10" : "right-3"
            )}
          />
        )}
      </div>

      {/* Loading indicator */}
      {!isReady && !error && (
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading Google Maps...
        </p>
      )}

      {/* Results dropdown */}
      {showResults && predictions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto bg-background border shadow-lg">
          <div className="py-1">
            {predictions.map((prediction) => (
              <button
                key={prediction.placeId}
                onClick={() => handleSelect(prediction)}
                className={cn(
                  "w-full px-3 py-2 text-left hover:bg-accent transition-colors",
                  "flex items-start gap-2"
                )}
              >
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">
                    {prediction.mainText}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {prediction.secondaryText}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <img 
                src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png" 
                alt="Powered by Google" 
                className="h-3"
              />
            </p>
          </div>
        </Card>
      )}

      {/* No results / Error message */}
      {showResults && query.length >= 3 && !isSearching && predictions.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border shadow-lg">
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            {error ? (
              <>
                <p className="font-medium text-destructive">{error}</p>
                <p className="text-xs mt-1">Try again or use GPS location</p>
              </>
            ) : (
              <>
                <p>No locations found for "{query}"</p>
                <p className="text-xs mt-1">Try a landmark, area, or road name</p>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
