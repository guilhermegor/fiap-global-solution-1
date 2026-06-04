import { Loader2, Search } from 'lucide-react';
import { useRef, useState } from 'react';

import type { Region } from '../../domain/entities';
import { useRotaSegura } from '../../use-context';
import styles from '../styles.module.css';

/** Shared region search bar (Nominatim geocoding) used on Central + Cidadão. */
export function RegionSearch() {
  const { regionResults, searchRegion, searching, selectRegion, region } = useRotaSegura();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = inputRef.current?.value ?? '';
    setOpen(true);
    void searchRegion(query);
  }

  function handlePick(picked: Region) {
    setOpen(false);
    if (inputRef.current) inputRef.current.value = picked.name;
    void selectRegion(picked);
  }

  return (
    <div className={styles.regionSearch}>
      <form className={styles.regionForm} onSubmit={handleSubmit} role="search">
        <Search size={18} aria-hidden="true" className={styles.regionIcon} />
        <input
          ref={inputRef}
          type="text"
          className={styles.regionInput}
          placeholder="Buscar cidade ou região (ex.: Porto Alegre)"
          aria-label="Buscar região"
          defaultValue={region?.name ?? ''}
        />
        <button type="submit" className={styles.regionButton} disabled={searching}>
          {searching ? <Loader2 size={16} className={styles.spin} aria-hidden="true" /> : 'Buscar'}
        </button>
      </form>

      {open && regionResults.length > 0 && (
        <ul className={styles.regionResults}>
          {regionResults.map((result, index) => (
            <li key={`${result.displayName}-${index}`}>
              <button type="button" className={styles.regionResult} onClick={() => handlePick(result)}>
                <strong>{result.name}</strong>
                <span>{result.displayName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
