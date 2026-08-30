import { RawExpense } from "./expense";
import { RawSavingsPocket } from "./pocket";

export interface CompetitionCase {
  case_id: string;
  today: string;
  months: {
    last: string;
    this: string;
  };
  salary_bdt: string;
  expenses: RawExpense[];
  pockets: RawSavingsPocket[];
  dps_annual_rate_percent?: string;
  dps_rule?: string;
}

export interface PublicDataset {
  schema_version: string;
  problem_id: string;
  format_note: string;
  cases: CompetitionCase[];
}
