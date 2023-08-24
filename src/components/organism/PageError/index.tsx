import Button from "../../atom/Button";

export type FallbackProps = {
  error: Error | undefined;
  resetErrorBoundary: () => void;
};

const PageError = ({ error, resetErrorBoundary }: FallbackProps) => {
  const onReset = () => {
    resetErrorBoundary();
  };

  return (
    <div>
      Error: <pre>{error?.message}</pre>
      <div>
        <Button onClick={onReset}>Try again</Button>
      </div>
    </div>
  );
};

export default PageError;
