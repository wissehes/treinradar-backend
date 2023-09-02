import NS from "~/shared/NS";

export default async function getSpoorkaart() {
  const { data } = await NS.get<{ payload: Record<string, unknown> }>(
    "/Spoorkaart-API/api/v1/spoorkaart"
  );

  return data.payload;
}
