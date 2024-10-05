export const Text = ({ value }: { value: string | undefined }) => {
  return <div>{value}</div>;
};

export const Img = ({ value }: { value: string | undefined }) => {
  return <img src={value} alt="" />;
};

export const Input = ({
  label,
  value,
  placeholder,
  inputType,
  formItemName,
  formKey,
}: any) => {
  return (
    <input
      className={"input" + formKey}
      name={formItemName}
      value={value}
      placeholder={placeholder}
      type={inputType}
      checked={value}
      style={{ width: "100%", height: "100%" }}
      aria-label={label}
    />
  );
};

export const Button = ({ value }: any) => {
  return <div>{value}</div>;
};
