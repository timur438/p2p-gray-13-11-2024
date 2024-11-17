import type {NamedColor} from 'quasar'

export interface ITableCellCtx {
  col: any
  value: any
  key: any
  row: any
  rowIndex: number
  pageIndex: number
  cols: any
  colsMap: any
  sort: (col: any) => void
  selected: boolean
  expand: boolean
  color: NamedColor
  dark?: boolean | null
  dense: boolean
}
