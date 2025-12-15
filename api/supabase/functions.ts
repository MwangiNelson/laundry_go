export const get_profile = (userId: string) => {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${userId}/avatar`;
  console.log({ url });
  return url;
};
