export const Button = ({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "ghost";
}) => {
  const variants = {
    default: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
    ghost: "p-2 rounded hover:bg-gray-200",
  };

  return (
    <button onClick={onClick} className={variants[variant] || variants.ghost}>
      {children}
    </button>
  );
};
