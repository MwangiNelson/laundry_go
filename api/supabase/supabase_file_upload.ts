import { createSupabaseClient } from "../supabase/client";
export const uploadFile = async (
  file: File,
  options?: {
    bucket?: string;
    path?: string;
  }
) => {
  try {
    const supabase = createSupabaseClient();
    const bucket = options?.bucket || "documents";
    const basePath = options?.path || "";
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = basePath ? basePath : fileName;

    const { error, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "0",
        upsert: false,
      })
      .then((res) => {
        console.log(res);
        return res;
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = await supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error("Upload file error:", error);
    throw error;
  }
};

export const deleteFile = async (publicUrl: string | null) => {
  const supabase = await createSupabaseClient();
  if (!publicUrl) return;
  const filepath = publicUrl?.split("/public/")[1];
  if (!filepath) return;
  const bucketName = filepath?.split("/")[0];
  const filePath = filepath?.slice(bucketName.length + 1);

  const fileExists = await checkFileExists(bucketName, filePath);
  if (!fileExists) return;
  console.log("deleting file");
  const { error } = await supabase.storage.from(bucketName).remove([filePath]);

  if (error) {
    console.error("Delete file error:", error);
  }
};
//replace file

export const replaceFile = async ({
  file,
  publicUrl,
  options,
}: {
  file: File;
  publicUrl?: string | null;
  options?: {
    bucket?: string;
    path?: string;
  };
}) => {
  try {
    const supabase = createSupabaseClient();
    if (!publicUrl && !options?.bucket) return;

    let bucketName = options?.bucket;
    let filePath = options?.path;

    if (publicUrl && !options?.bucket) {
      const filepath = publicUrl.split("/public/")[1];
      bucketName = filepath.split("/")[0];
      filePath = filepath.slice(bucketName.length + 1);
    }
    const fileExists = await checkFileExists(bucketName!, filePath!);
    if (fileExists) {
      await deleteFile(publicUrl!);
    }

    return await uploadFile(file, {
      bucket: options?.bucket || bucketName,
      path: options?.path || filePath,
    });
  } catch (error) {
    console.error("Replace file error:", error);
    throw error;
  }
};

async function checkFileExists(bucketName: string, filePath: string) {
  const { data, error } = await createSupabaseClient()
    .storage.from(bucketName)
    .list(filePath.substring(0, filePath.lastIndexOf("/")), {
      search: filePath.substring(filePath.lastIndexOf("/") + 1),
    });

  if (error) {
    console.error("Error checking file existence:", error);
    return false;
  }

  const files = data.filter(
    (item) => item.name === filePath.substring(filePath.lastIndexOf("/") + 1)
  );
  return files.length > 0;
}
export interface UploadedFile {
  url: string;
  name: string;
}
export const uploadFiles = async (
  files: File[],
  bucket: string,
  pathPrefix: string
): Promise<UploadedFile[]> => {
  if (!files?.length) return [];

  const uploadPromises = files.map(async (file) => {
    const result = await uploadFile(file, {
      bucket,
      path: `${pathPrefix}/${Date.now()}-${file.name}`,
    });
    return { url: result.url, name: result.name };
  });

  return await Promise.all(uploadPromises);
};
export const cleanUpFiles = async (
  files: (UploadedFile | string)[]
): Promise<void> => {
  if (!files?.length) return;

  await Promise.allSettled(
    files.map((file) =>
      typeof file === "string" ? deleteFile(file) : deleteFile(file.url)
    )
  );
};
