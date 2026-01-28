export const get_profile = (userId: string) => {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profiles/${userId}/avatar`;

  return url;
};
export const get_vendor_logo = (business_id: string) => {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vendor-assets/vendor-assets/${business_id}/logo`;
  return url;
};
