const TextInput = ({
  type,
  label,
  placeholder,
  className,
  value,
  setValue,
  labelClassName,
}) => {
  return (
    <div className={`textInputDiv flex flex-col space-y-1 ${className}`}>
      <label for={label} className={`font-semibold ${labelClassName}`}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="p-3 border border-gray-400 border-solid rounded items-center placeholder-gray-500"
        id={label}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
};

export default TextInput;
