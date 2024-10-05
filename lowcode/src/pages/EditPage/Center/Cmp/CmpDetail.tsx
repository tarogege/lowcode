export const Text = ({ value }: { value: string | undefined }) => {
  return <>{value}</>;
};

export const Img = ({ value }: { value: string | undefined }) => {
  return <img style={{ width: "100%", height: "100%" }} src={value} alt="" />;
};

export const Input = ({ value, inputType, placeholder, formItemName }: any) => {
  return (
    <input
      type={inputType}
      value={value}
      placeholder={placeholder}
      style={{ width: "100%", height: "100%" }}
      disabled
      checked={value}
      name={formItemName}
      onChange={() => {}}
    />
  );
};

export const Button = ({ value }: { value: string | undefined }) => {
  return <div>{value}</div>;
};
