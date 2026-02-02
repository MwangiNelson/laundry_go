-- Create function to get vendor dashboard statistics
CREATE OR REPLACE FUNCTION get_vendor_dashboard_stats(
  p_vendor_id UUID,
  p_period TEXT DEFAULT 'month'
)
RETURNS TABLE (
  new_orders BIGINT,
  in_progress_orders BIGINT,
  ready_for_delivery BIGINT,
  total_orders BIGINT,
  total_revenue NUMERIC,
  prev_new_orders BIGINT,
  prev_in_progress_orders BIGINT,
  prev_ready_for_delivery BIGINT,
  prev_total_orders BIGINT,
  prev_total_revenue NUMERIC
) AS $$
DECLARE
  current_start_date TIMESTAMPTZ;
  current_end_date TIMESTAMPTZ;
  prev_start_date TIMESTAMPTZ;
  prev_end_date TIMESTAMPTZ;
BEGIN
  -- Set current period dates
  current_end_date := NOW();
  
  CASE p_period
    WHEN 'month' THEN
      current_start_date := DATE_TRUNC('month', NOW());
      prev_end_date := current_start_date;
      prev_start_date := DATE_TRUNC('month', NOW() - INTERVAL '1 month');
    WHEN 'year' THEN
      current_start_date := DATE_TRUNC('year', NOW());
      prev_end_date := current_start_date;
      prev_start_date := DATE_TRUNC('year', NOW() - INTERVAL '1 year');
    WHEN 'all' THEN
      current_start_date := '1970-01-01'::TIMESTAMPTZ;
      prev_start_date := '1970-01-01'::TIMESTAMPTZ;
      prev_end_date := '1970-01-01'::TIMESTAMPTZ;
    ELSE
      current_start_date := DATE_TRUNC('month', NOW());
      prev_end_date := current_start_date;
      prev_start_date := DATE_TRUNC('month', NOW() - INTERVAL '1 month');
  END CASE;

  RETURN QUERY
  WITH current_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE o.status = 'under_review') AS new_orders_count,
      COUNT(*) FILTER (WHERE o.status IN ('accepted', 'in_pickup', 'in_processing')) AS in_progress_count,
      COUNT(*) FILTER (WHERE o.status = 'ready_for_delivery') AS ready_count,
      COUNT(*) AS total_orders_count,
      COALESCE(SUM(o.total_price), 0) AS total_revenue_sum
    FROM orders o
    WHERE o.vendor_id = p_vendor_id
      AND o.created_at >= current_start_date
      AND o.created_at <= current_end_date
      AND o.status != 'cancelled'
  ),
  prev_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE o.status = 'under_review') AS prev_new_orders_count,
      COUNT(*) FILTER (WHERE o.status IN ('accepted', 'in_pickup', 'in_processing')) AS prev_in_progress_count,
      COUNT(*) FILTER (WHERE o.status = 'ready_for_delivery') AS prev_ready_count,
      COUNT(*) AS prev_total_orders_count,
      COALESCE(SUM(o.total_price), 0) AS prev_total_revenue_sum
    FROM orders o
    WHERE o.vendor_id = p_vendor_id
      AND o.created_at >= prev_start_date
      AND o.created_at < prev_end_date
      AND o.status != 'cancelled'
      AND p_period != 'all'
  )
  SELECT
    cs.new_orders_count::BIGINT,
    cs.in_progress_count::BIGINT,
    cs.ready_count::BIGINT,
    cs.total_orders_count::BIGINT,
    cs.total_revenue_sum::NUMERIC,
    COALESCE(ps.prev_new_orders_count, 0)::BIGINT,
    COALESCE(ps.prev_in_progress_count, 0)::BIGINT,
    COALESCE(ps.prev_ready_count, 0)::BIGINT,
    COALESCE(ps.prev_total_orders_count, 0)::BIGINT,
    COALESCE(ps.prev_total_revenue_sum, 0)::NUMERIC
  FROM current_stats cs
  LEFT JOIN prev_stats ps ON TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
