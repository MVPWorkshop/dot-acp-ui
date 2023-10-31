import { FC, useState } from "react";
import { NumericFormat } from "react-number-format";

interface AmountPercentageProps {
  maxValue: number;
  onChange: (value: number) => void;
}

const AmountPercentage: FC<AmountPercentageProps> = ({ maxValue, onChange }) => {
  const [value, setValue] = useState<number>(100);

  const handleClick = (value: number) => {
    setValue(value);
    onChange(value);
  };

  return (
    <div className="py-5">
      <h6 className="mb-2 text-center text-[13px]">Amount percentage</h6>
      <div className="flex items-center gap-[6px]">
        <div className="relative w-[75px]">
          <NumericFormat
            value={value}
            isAllowed={(values) => {
              const { formattedValue, floatValue } = values;
              return formattedValue === "" || (floatValue !== undefined && floatValue <= 100);
            }}
            onValueChange={({ value }) => {
              onChange(Number(value));
            }}
            fixedDecimalScale={true}
            thousandSeparator={false}
            allowNegative={false}
            className="w-full rounded-lg bg-purple-100 p-2 text-large  text-gray-200 outline-none"
          />
          <span className="absolute right-2 top-[10px] text-medium text-gray-100">%</span>
        </div>
        <button
          className="flex h-[37px] w-[65px] items-center justify-center rounded-[100px] bg-pink bg-opacity-10 text-[11px] tracking-[.66px] text-pink"
          onClick={() => handleClick(25)}
        >
          25%
        </button>
        <button
          className="flex h-[37px] w-[65px] items-center justify-center rounded-[100px] bg-pink bg-opacity-10 text-[11px] tracking-[.66px] text-pink"
          onClick={() => handleClick(50)}
        >
          50%
        </button>
        <button
          className="flex h-[37px] w-[65px] items-center justify-center rounded-[100px] bg-pink bg-opacity-10 text-[11px] tracking-[.66px] text-pink"
          onClick={() => handleClick(75)}
        >
          75%
        </button>
        <button
          className="flex h-[37px] w-[65px] items-center justify-center rounded-[100px] bg-pink bg-opacity-10 text-[11px] tracking-[.66px] text-pink"
          onClick={() => handleClick(maxValue)}
        >
          Max
        </button>
      </div>
    </div>
  );
};

export default AmountPercentage;
