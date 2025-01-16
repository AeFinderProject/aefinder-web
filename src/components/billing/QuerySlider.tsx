import type { SliderSingleProps } from 'antd';
import { Slider } from 'antd';
import { useMemo } from 'react';

type QuerySliderProps = {
  readonly currentQueryCount: number; // Current slider value (real value)
  readonly setCurrentQueryCount: (value: number) => void; // Callback to update the real value
  readonly freeQuantity: number; // FREE limit
  readonly isLocked: boolean; // Lock the slider if true
};

export default function QuerySlider({
  currentQueryCount,
  setCurrentQueryCount,
  freeQuantity,
  isLocked,
}: QuerySliderProps) {
  // Define ranges with percentages
  const ranges = useMemo(
    () => [
      { min: 0, max: 100000, percentage: 0.1 }, // FREE zone (10%)
      { min: 100000, max: 250000, percentage: 0.3 }, // 30% distribution
      { min: 250000, max: 1000000, percentage: 0.2 }, // 20% distribution
      { min: 1000000, max: 10000000, percentage: 0.2 }, // 20% distribution
      { min: 10000000, max: 50000000, percentage: 0.1 }, // 10% distribution
      { min: 50000000, max: 250000000, percentage: 0.1 }, // 10% distribution
    ],
    []
  );

  // Map the real value to the virtual slider position (10 - 100)
  const mapRealToVirtual = (realValue: number): number => {
    let accumulatedPercentage = 10; // FREE zone takes the first 10%
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      const rangeLength = range.max - range.min;

      if (realValue <= range.max) {
        const withinRange = realValue - range.min;
        // Ensure consistent Math.floor for precision
        return (
          accumulatedPercentage +
          Math.floor((withinRange / rangeLength) * range.percentage * 90) // Compute position in remaining 90%
        );
      }

      accumulatedPercentage += Math.floor(range.percentage * 90);
    }
    return 100; // Max value always maps to 100
  };

  // Map the virtual slider position back to the real value
  const mapVirtualToReal = (virtualValue: number): number => {
    let accumulatedPercentage = 10; // First 10% reserved for FREE
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      const rangeLength = range.max - range.min;

      const rangeStartPercentage = accumulatedPercentage;
      const rangeEndPercentage =
        accumulatedPercentage + Math.floor(range.percentage * 90);

      if (virtualValue <= rangeEndPercentage) {
        const percentageInRange =
          (virtualValue - rangeStartPercentage) /
          (rangeEndPercentage - rangeStartPercentage);

        // Ensure consistent Math.round when returning real value
        return range.min + Math.round(percentageInRange * rangeLength);
      }

      accumulatedPercentage += Math.floor(range.percentage * 90);
    }
    return ranges[ranges.length - 1].max; // Max value maps to the max real value
  };

  // Marks for the slider
  const marks: SliderSingleProps['marks'] = {
    10: {
      style: { fontSize: '12px', color: '#808080' },
      label: <strong>[FREE]</strong>,
    },
    [mapRealToVirtual(100000)]: {
      style: { fontSize: '12px', color: '#808080' },
      label: <strong>100K</strong>,
    },
    [mapRealToVirtual(250000)]: {
      style: { fontSize: '12px', color: '#808080' },
      label: <strong>250K</strong>,
    },
    [mapRealToVirtual(1000000)]: {
      style: { fontSize: '12px', color: '#808080' },
      label: <strong>1M</strong>,
    },
    [mapRealToVirtual(10000000)]: {
      style: { fontSize: '12px', color: '#808080' },
      label: <strong>10M</strong>,
    },
    [mapRealToVirtual(50000000)]: {
      style: { fontSize: '12px', color: '#808080' },
      label: <strong>50M</strong>,
    },
    [mapRealToVirtual(250000000)]: {
      style: { fontSize: '12px', color: '#808080' },
      label: <strong>250M</strong>,
    },
  };

  // Render the slider component
  return (
    <div>
      <Slider
        min={10} // FREE zone is not selectable
        max={100} // Virtual max value
        step={1} // Step size
        marks={marks} // Key marks for the slider
        value={mapRealToVirtual(currentQueryCount)} // Map real value to virtual
        onChange={(value) => {
          const realValue = mapVirtualToReal(value); // Convert slider position to real value
          if (realValue <= freeQuantity) {
            // Force move to FREE limit
            setCurrentQueryCount(freeQuantity);
            return;
          }
          setCurrentQueryCount(realValue); // Update real value
        }}
        disabled={isLocked} // Lock slider if needed
        tooltip={{
          formatter: () => {
            // Ensure tooltip always reflects the currentQueryCount value
            return currentQueryCount <= freeQuantity
              ? `${currentQueryCount.toLocaleString()} [FREE]`
              : `${currentQueryCount.toLocaleString()} Queries`;
          },
        }}
      />
    </div>
  );
}
