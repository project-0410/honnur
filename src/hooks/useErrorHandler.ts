
import { useToast } from "@/hooks/use-toast";

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: Error | any, defaultMessage?: string) => {
    console.error('Error occurred:', error);
    
    let message = defaultMessage || 'An error occurred';
    
    if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  return {
    handleError,
    handleSuccess
  };
};
