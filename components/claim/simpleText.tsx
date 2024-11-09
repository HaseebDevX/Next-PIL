export const SimpleText = (prop: { title: string; textColor?: string }) => {
  return <p className={`text-gingerRegular text-lg ${prop.textColor ? prop.textColor : 'text-black'}`}>{prop.title}</p>;
};
