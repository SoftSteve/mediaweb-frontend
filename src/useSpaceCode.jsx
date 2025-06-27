import { useLocation } from 'react-router-dom';

export default function useSpaceCode() {
  return useLocation().state?.spaceCode ?? null;
}