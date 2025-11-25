// @/types/Diamondtable.ts
import { type InclusionFilters } from "../components/InclusionFilter";
import { type PriceLocationFilters } from "../components/Priceandloction";

export interface DiamondData {
  _id: string;
  STONE_NO: string;
  SHAPE: string;
  CARATS: number;
  COLOR: string;
  MP4?: string;
  HA?: string;
  CLARITY: string;
  CUT?: string;
  POL?: string;
  SYM?: string;
  FLOUR?: string;
  LAB: string;
  REPORT_NO: string;
  REPORT_DATE?: string;
  MEASUREMENTS?: string;
  TABLE_PER?: number;
  DEPTH_PER?: number;
  CROWN_ANGLE?: number;
  CROWN_HEIGHT?: number;
  PAVILLION_ANGLE?: number;
  PAVILLION_HEIGHT?: number;
  RAP_PRICE: number;
  DISC_PER: number;
    // ...existing fields...
    CERTI_PDF?: string;
    NET_RATE?: string;
  NET_VALUE: number;
  LOCATION: string;
  STAGE: string;
  TINGE?: string;
  CN?: string;
  CW?: string;
  SN?: string;
  SW?: string;
  KEY_TO_SYMBOLS?: string;
  COMMENTS_1?: string;
  REPORT_COMMENTS?: string;
  REAL_IMAGE?: string;
  SIZE?: number;
  EY_CLN?: string;
  H_AND_A?: string;
  priceFilters?: string;
}

export interface FilterParams {
  shape?: string;
  color?: string;
  limit?: number;
  page?: number;
  minCarats?: number;
  maxCarats?: number;
  fluorescence?: string;
  clarity?: string;
  cut?: string;
  polish?: string;
  symmetry?: string;
  searchTerm?: string;
  lab?: string;
  location?: string;
  priceLocationFilters?: string;
  CN?: string;
  CW?: string;
  SN?: string;
  SW?: string;
  keyToSymbols?: string;
  eyCln?: string;
  hAndA?: string;

  netRateMin?: number;
  netRateMax?: number;
  netValueMin?: number;
  netValueMax?: number;
  discPerMin?: number;
  discPerMax?: number;
}

// For DiamondStockTable component
export interface TableProps {
  pageSize?: number;
  onRowClick?: (diamond: DiamondData) => void;
  searchTerm?: string;
  selectedShape?: string[];
  selectedColor?: string[];
  selectedMinCarat?: string;
  selectedMaxCarat?: string;
  selectedFluor?: string[];
  selectedClarity?: string[];
  selectedCut?: string;
  selectedPolish?: string;
  selectedSymmetry?: string;
  onSelectionChange?: (selectedIds: string[], diamonds: DiamondData[]) => void;
  inclusionFilters?: InclusionFilters;
  priceLocationFilters?: PriceLocationFilters;
  selectedLocations?: string[];
  selectedLabs?: string[];
  keySymbolFilters?: KeySymbolFilters;
  priceFilters?: {
    pricePerCarat: { from: string; to: string };
    discount: { from: string; to: string };
    totalPrice: { from: string; to: string };
  };
  clearSelectionTrigger?: number;
}
export interface KeySymbolFilters {
  keyToSymbol: string[];
  eyCln: string[];
  hAndA: string[];
}

// For DiamondGridView component
export interface GridViewProps {
  pageSize?: number;
  onRowClick?: (diamond: DiamondData) => void;
  searchTerm?: string;
  selectedShape?: string[];
  selectedColor?: string[];
  selectedMinCarat?: string;
  selectedMaxCarat?: string;
  selectedFluor?: string[];
  selectedClarity?: string[];
  selectedCut?: string;
  selectedPolish?: string;
  selectedSymmetry?: string;
  inclusions?: InclusionFilters;
  selectedLocations?: string[];
  selectedLabs?: string[];
  keySymbolFilters?: {
    keyToSymbol: string[];
    eyCln: string[];
    hAndA: string[];
  };
  inclusionFilters?: {
    centerBlack: string[];
    centerWhite: string[];
    sideBlack: string[];
    sideWhite: string[];
  };
  priceFilters?: {
    pricePerCarat: { from: string; to: string };
    discount: { from: string; to: string };
    totalPrice: { from: string; to: string };
  };
}

// API Response types
export interface DiamondApiResponse {
  success: boolean;
  data?: DiamondData[] | { diamonds: DiamondData[] };
  message?: string;
}

export interface CartApiResponse {
  success: boolean;
  message?: string;
  data?: {
    [key: string]: unknown;
  };
}
