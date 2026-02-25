import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { activeStatus } from "./variable";

dayjs.extend(duration);

export function formatDate(
  val: string | null | undefined,
  pattern: string,
): string | null {
  if (!val) {
    return null;
  }

  const date = dayjs(val);
  if (!date.isValid()) {
    return null;
  }

  return date.locale("id").format(pattern);
}

export const currency = (val: unknown): string | null | undefined => {
  if (val === null) return val;
  if (val === undefined) return val;
  if (val === "") return val;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(val));
};

export function formatNumber(
  val: number | string | null | undefined,
): string | null {
  const number = Number(val);
  if (isNaN(Number(number))) {
    return null;
  }

  return Intl.NumberFormat("id-ID").format(number);
}

export function formatProcessingTime(pt: number) {
  if (pt < 1000) {
    // Jika di bawah 1 detik
    return `${pt} ms`;
  } else if (pt < 60 * 1000) {
    // Jika di bawah 1 menit
    const seconds = Math.floor(pt / 1000);
    return `${seconds} s`;
  } else if (pt < 60 * 60 * 1000) {
    // Jika di bawah 1 jam
    const minutes = Math.floor(pt / (60 * 1000));
    return `${minutes} m`;
  }
  // Selanjutnya gunakan format HH:mm:ss.SSS
  const formatted = dayjs.duration(pt).format("HH:mm:ss.SSS");
  return formatted;
}

export function formatActiveStatus(val: any) {
  if (!val) return "";
  return (
    activeStatus.find(
      (x) => x.value.toLowerCase() === (val as string).toLowerCase(),
    )?.label ?? "Tidak Diketahui"
  );
}

export function formatActiveStatusColor(val: any) {
  if (!val) return "";
  return (
    activeStatus.find(
      (x) => x.value.toLowerCase() === (val as string).toLowerCase(),
    )?.color ?? "var(--mantine-primary-color-filled)"
  );
}
