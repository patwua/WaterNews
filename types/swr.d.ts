declare module 'swr' {
  const useSWR: <T = any>(key: any, fetcher: any, config?: any) => any;
  export default useSWR;
}
