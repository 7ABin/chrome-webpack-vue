export const initHead = `
  import {METHOD, request} from "@/utils/request";
  import {BASE_URL} from "@/services/api";
  const baseServer= 'xxx' // 服务器名称
 `
export const initContent =
`
// %title%
export async function api%val%(param) {
  return request(\`\${BASE_URL}\${baseServer}%path%\`, METHOD.%method%, param)
}
`
