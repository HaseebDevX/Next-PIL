import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import './styles.css';

const RadioGroupDemo = (prop: {
  options: { label: string; value: string }[];
  vertical?: boolean;
  onChange: (val: string) => void;
  defaultValue: string;
  name: string;
}) => (
  <RadioGroup.Root
    onValueChange={(value: string) => {
      prop.onChange(value);
    }}
    className='RadioGroupRoot'
    defaultValue={prop.defaultValue}
    aria-label={prop.name}
    name={prop.name}
  >
    <div className={`${prop?.vertical ? 'flex flex-col' : 'flex flex-row'} `}>
      {prop.options.map((option, index) => (
        <div style={{ display: 'flex', alignItems: 'center' }} key={option.value + prop.name}>
          <RadioGroup.Item className='RadioGroupItem' value={option.value} id={option.value + prop.name}>
            <RadioGroup.Indicator className='RadioGroupIndicator' />
          </RadioGroup.Item>
          <label className='Label pr-5' htmlFor={option.value + prop.name}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  </RadioGroup.Root>
);

export default RadioGroupDemo;
