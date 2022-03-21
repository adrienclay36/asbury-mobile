import { supabase } from "./supabase-service";

export const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;
  return { from, to };
};

export const getPagedData = async (page, size, table) => {
  let { from, to } = getPagination(page, size);
  const { data } = await supabase
    .from(table)
    .select()
    .order("id", { ascending: true })
    .range(from, to - 1);

  return data;
};

export const getPagedBookData = async (page, size, table) => {
  let { from, to } = getPagination(page, size);
  const { data, error } = await supabase
    .from(table)
    .select()
    .order("deweynumber", { ascending: true })
    .range(from, to - 1);

  return data;
};

export const getPagedDataByDate = async (page, size, table, dateColumn) => {
  let { from, to } = getPagination(page, size);
  const { data } = await supabase
    .from(table)
    .select()
    .order(dateColumn, { ascending: false })
    .order("id", { ascending: false })
    .range(from, to - 1);

  return data;
};

export const getPagedDataByID = async (page, size, table, dateColumn) => {
  let { from, to } = getPagination(page, size);
  const { data } = await supabase
    .from(table)
    .select()
    .order("id", { ascending: false })
    .range(from, to - 1);

  return data;
};

export const getUserPostCount = async (userID) => {
  const { count } = await supabase.from('prayers').select("*", { count: 'exact'}).match( { user_id: userID });
  return count;
}

export const getTotalPages = async (size, table) => {
  const { count } = await supabase.from(table).select("*", { count: "exact" });

  const totalPages = Math.ceil(count / size);
  return totalPages;
};

export const splitQuery = (queryToSplit) => {
  if (queryToSplit) {
    const queryVector = queryToSplit.split(" ");
    const filtered = queryVector.filter((word) => word !== "" && word !== " ");
    if (filtered.length > 1) {
      const joinedAnd = filtered.join(" & ");
      return joinedAnd;
    } else {
      return queryToSplit.trim();
    }
  }
};

export const getQueriedData = async (table, query, queryFunction) => {
  const andQuery = splitQuery(query);
  if (andQuery) {
    const { data } = await supabase.rpc(queryFunction, { keyword: andQuery });
    let status = "No Data";
    if (data.length === 0) {
      return { data, status };
    }
    return { data: data, status: "ok" };
  }
  return;
};

export const getItemById = async (table, id) => {
  const { data } = await supabase.from(table).select().match({ id });
  return data;
};

export const getAllItems = async (table) => {
  const { data } = await supabase.from(table).select();

  return data;
};

export const getAllItemsSorted = async (table, sortColumn) => {
  const { data } = await supabase.from(table).select().order(sortColumn, { ascending: false });
  return data;
}

export const addItemToTable = async (table, object) => {
  try {
    const { data, error } = await supabase.from(table).insert([object]);
    
    return { status: "ok", error: "None" };
  } catch (err) {
    return { status: "error", error: err.message };
  }
};

export const deleteItemFromTable = async (table, id) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match({ id: id });
    return { status: "ok", error: "None" };
  } catch (err) {
    return { status: "error", error: err.message };
  }
};

export const updateItemInTable = async (table, id, object) => {
  try {
    await supabase.from(table).update(object).match({ id: id });
    return { status: "ok", error: "None" };
  } catch (err) {
    return { status: "error", error: err.message };
  }
};

export const toggleBooleanValue = async (table, id, column) => {
  try {
    const { data } = await supabase
      .from(table)
      .select(column)
      .match({ id: id });
    const originalValue = data[0][column];
    await supabase
      .from(table)
      .update({ availability: !originalValue })
      .match({ id: id });
    return { status: "ok", error: "None" };
  } catch (err) {
    return { status: "error", error: err.message };
  }
};

export const getSignedUrl = async (bucket, filename) => {
  const { signedURL, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filename, 60);
  return signedURL;
};

export const getPublicUrl = async (bucket, filename) => {
  const { publicURL, error } = await supabase.storage
    .from(bucket)
    .getPublicUrl(filename);
  return publicURL;
};

/* AUTH FUNCTIONS */

export const checkAdmin = async (req) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      props: {},
      redirect: { destination: "/admin" },
    };
  }

  const { data, error } = await supabase
    .from("users")
    .select()
    .match({ id: user.id });
  let userInfo;
  if (data) {
    userInfo = data[0];
    if (!user || userInfo.role !== "admin") {
      return {
        props: {},
        redirect: { destination: "/" },
      };
    }
  }

  return {
    props: { user, userInfo },
  };
};

export const checkUser = async (req) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      props: {},
      redirect: { destination: "/" },
    };
  }
  const userInfo = await getUser(user.id);

  return {
    props: { user: userInfo },
  };
};

export const getPermissions = async (req, permissionSet) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      props: {},
      redirect: { destination: "/admin" },
    };
  }

  const { data, error } = await supabase
    .from("users")
    .select()
    .match({ id: user.id });
  let userInfo;
  if (data) {
    userInfo = data[0];
    const permitted = userInfo.permissions.some((permission) =>
      permissionSet.includes(permission)
    );

    if (!user || !permitted) {
      return {
        props: {},
        redirect: { destination: "/admin/admin-dashboard" },
      };
    }
  }

  return {
    props: { user },
  };
};

export const getUser = async (id, column) => {
  if (column) {
    const { data, error } = await supabase
      .from("users")
      .select(column)
      .match({ id: id });

    let userInfo;
    if (data) {
      userInfo = data[0];
      return userInfo;
    }
  }

  const { data, error } = await supabase
    .from("users")
    .select()
    .match({ id: id });

  let userInfo;
  if (data) {
    userInfo = data[0];
    return userInfo;
  }
};

export const downloadImage = async (bucket, path) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) {
      throw error;
    }
    
    const url = URL.createObjectURL(data);
    return url;
  } catch (error) {
    console.log("Error downloading image: ", error.message);
  }
};
