declare const exports: any;
export * from './brandkits/rev2';
export { default } from './brandkits/rev2';

/**
 * Switch brand token kits at runtime.
 * Default is rev2. Calling this will mutate exported values.
 */
export async function setBrandKit(revision: 'rev1' | 'rev2') {
  const mod =
    revision === 'rev1'
      ? await import('./brandkits/rev1')
      : await import('./brandkits/rev2');
  Object.assign(exports, mod);
}
