'use client';
import { useState, useEffect } from 'react';
import Feed from '../../components/feed/Feed';

export default function Home(){
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Feed />
  );
}
