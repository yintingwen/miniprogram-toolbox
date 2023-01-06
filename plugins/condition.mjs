import { parse } from '@babel/parser'
import MagicString from "magic-string";

export default function (options = {}) {
    return {
        name: 'condition-comment',
        transform (code, id) {
            const { platform } = options
            if (!platform) return code

            const s = new MagicString(code)
            let conditionStart = undefined
            let conditionOpen = false

            const ast = parse(code, { sourceType: 'module'})
            const { comments } = ast
            if (!comments.length) return code

            comments.forEach(comment => {
                if (comment.type !== 'CommentLine') return code
                const commentStr = comment.value.trim()

                if (/^#ifn?def/g.test(commentStr)) {
                    // 判断是包含还是排除
                    let conditionInclude = commentStr.includes('ifdef')
                    // 获取后面的平台字符串
                    const platformStr = commentStr.replace(/#ifn?def/g, '').trim()
                    if (!platformStr) return code
                    // 获取指定平台数组
                    const platforms = platformStr.split('||').map(item => item.trim())
                    // 包含条件，且包含其中，保留不进行裁剪
                    if (conditionInclude && platforms.includes(platform)) return code
                    // 排除条件，且不包含其中，保留不进行裁剪
                    if (!conditionInclude && !platforms.includes(platform)) return code
                    // 包含模式 且 在指定的平台中
                    conditionStart = comment.start
                }
                if (/^#endif/.test(commentStr)) {
                    // 没有开启
                    if ( conditionStart === undefined) return code
                    s.remove(conditionStart, comment.end)
                    conditionOpen = true
                    conditionStart = undefined
                }
            })

            return conditionOpen ? {
                code: s.toString(),
                map: s.generateDecodedMap()
            } : code
        }
    }
}