export interface PocketTimelineShift {
  pocket_id: string;
  pocket_name: string;
  item: string;
  target_bdt: number;
  original_completion_date: string;
  new_completion_date: string;
  original_months: number;
  new_months: number;
  months_saved: number;
}

export interface WhatIfResult {
  category: string;
  cut_percentage: number;
  current_category_projected_bdt: number;
  saved_amount_bdt: number;
  original_surplus_bdt: number;
  new_projected_surplus_bdt: number;
  shifts: PocketTimelineShift[];
}
