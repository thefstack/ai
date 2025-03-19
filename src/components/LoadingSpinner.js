import { LoaderCircle } from 'lucide-react';
import styles from "@/css/LoadingSpinner.module.css"

const LoadingSpinner = () => {
  return (
    <LoaderCircle size={16} className={styles.loadingSpinner} />
  )
}


export default LoadingSpinner
