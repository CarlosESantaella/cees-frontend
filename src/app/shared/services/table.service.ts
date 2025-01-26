import { Injectable, PipeTransform } from '@angular/core';
import {
  SortColumn,
  SortDirection,
} from '../directives/table-sortable.directive';
import {
  BehaviorSubject,
  Observable,
  Subject,
  debounceTime,
  delay,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { DecimalPipe } from '@angular/common';
interface SearchResult {
  data: any;
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(countries: any[], column: SortColumn, direction: string): any[] {
  if (direction === '' || column === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(record: any, term: string, pipe: PipeTransform) {
  // return (
  // 	record.name.toLowerCase().includes(term.toLowerCase()) ||
  // 	pipe.transform(record.area).includes(term) ||
  // 	pipe.transform(record.population).includes(term)
  // );
  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      const value = record[key];

      if (
        typeof value === 'number' &&
        pipe.transform(value).includes(term.toLowerCase())
      ) {
        return true;
      } else if (
        typeof value === 'string' &&
        value.toLowerCase().includes(term.toLowerCase())
      ) {
        return true;
      }
    }
  }
  return false;
}
@Injectable({
  providedIn: 'root',
})
export class TableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  public _data$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  DATA: any[] = [];

  private _state: State = {
    page: 1,
    pageSize: 7,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(private pipe: DecimalPipe) {

  }


  public initDataTable(){
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._data$.next(result.data);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get data$() {
    return this._data$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    // 1. sort
    let data = sort(this.DATA, sortColumn, sortDirection);

    // 2. filter
    data = data.filter((country) => matches(country, searchTerm, this.pipe));
    const total = data.length;

    // 3. paginate
    data = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ data, total });
  }
}
