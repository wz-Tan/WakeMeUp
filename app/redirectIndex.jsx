import { useRouter } from "expo-router";

export default function RedirectIndex() {
  useRouter().replace("/");
}
