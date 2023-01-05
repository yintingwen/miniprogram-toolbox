import { parse } from '@babel/parser'
import MagicString from "magic-string";

export default (options = {}) => ({
    name: 'condition-comment',
    transform (code, id) {
        const s = new MagicString(code)
        const { platform } = options
        if (!platform) return code

        let conditionStart = undefined
        let conditionEnd = undefined
        let conditionOpen = false
        let conditionInclude = false

        const ast = parse(code, {
            sourceType: 'module'
        })

        const { comments } = ast
        if (!comments.length) return code
        comments.forEach(comment => {
            if (comment.type !== 'CommentLine') return
            const commentStr = comment.value.trim()
            if (/#ifn?def/g.test(commentStr)) {
                // 判断是包含还是排除
                conditionInclude = commentStr.includes('ifdef')
                // 获取后面的平台字符串
                const platformStr = commentStr.replace(/#ifn?def/g, '')
                if (!platformStr.trim()) return
                // 获取平台数组
                const platforms = platformStr.split('||').map(item => item.trim())
                if (!conditionInclude && platforms.length) throw new Error('#ifndef不能指定条件')
                if (platforms.includes(platform) && conditionInclude) return
                // 包含模式 且 在指定的平台中
                conditionStart = comment.start
            }
            if (/#endif/.test(commentStr)) {
                // 没有开启
                if ( conditionStart === undefined) return
                conditionEnd = comment.end
                console.log(conditionStart, conditionEnd)

                s.remove(conditionStart, conditionEnd)
                conditionOpen = true
            }
        })

        return conditionOpen ? s.toString() : code
    }
})