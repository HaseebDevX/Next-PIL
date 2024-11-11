import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import './styles.css';

const RadioGroupDemo = (prop: {
  defaultValue: string;
  name: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  vertical?: boolean;
}) => (
  <RadioGroup.Root
  aria-label={prop.name}
  className='RadioGroupRoot'
  defaultValue={prop.defaultValue}
  name={prop.name}
  onValueChange={(value: string) => {
    prop.onChange(value);
  }}
  >
    <div className={`${prop?.vertical ? 'flex flex-col' : 'flex flex-row'} `}>
      {prop.options.map((option, index) => (
        <div  key={option.value + prop.name} style={{ display: 'flex', alignItems: 'center' }}>
          <RadioGroup.Item className='RadioGroupItem' id={option.value + prop.name} value={option.value} >
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
