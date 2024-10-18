export const initHead = `
import {METHOD, request} from "@/utils/request";
import {BASE_URL} from "@/services/api";
`
export const baseServeName = 'xxx'
export const initContent =
`
// %title%
export async function %apiName%(param) {
  return request(\`\${BASE_URL}%baseServeName%%path%\`, METHOD.%method%, param)
}
`
