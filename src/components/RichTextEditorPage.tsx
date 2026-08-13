import { useState } from 'react'

function AnimatedEditorBackground() {
  return (
    <div className="editor-animated-bg" aria-hidden="true">
      <div className="editor-bg-gradient" />
      <div className="editor-aurora-orb editor-aurora-orb-1" />
      <div className="editor-aurora-orb editor-aurora-orb-2" />
      <div className="editor-aurora-orb editor-aurora-orb-3" />
      <div className="editor-aurora-orb editor-aurora-orb-4" />
      <div className="editor-bg-crossfade">
        <span />
        <span />
      </div>
      <div className="editor-bg-noise" />
    </div>
  )
}

function RichTextEditorPage() {
  const [opened, setOpened] = useState(false)

  return (
    <div className={`rich-editor-page ${opened ? 'is-opened' : ''}`}>
      <AnimatedEditorBackground />

      <div className="letter-envelope-stage" aria-hidden={opened ? 'true' : undefined}>
        <div className="letter-envelope">
          <div className="letter-envelope-paper" />
          <div className="letter-envelope-flap" />
          <button className="letter-wax-seal" type="button" onClick={() => setOpened(true)} aria-label="打开信封">
            <span />
          </button>
        </div>
      </div>

      <div className="rich-editor-card">
        <div className="rich-editor-card-aurora" />
        <div className="rich-editor-card-gloss" />

        <article className="rich-editor-surface letter-content" aria-label="一封信">
          <p>亲爱的嘉欣：</p>
          <p>见字如面。</p>
          <p>我们相恋一百天，相识一百二十天了。我把这段时光里的小确幸整理成了一个网站，希望你会喜欢。</p>
          <p>
            回看那些没有放进来的聊天记录时，我才意识到，早期的自己带着那么多套路，有时候还自说自话，是在顾着自己，没有真正看见你。二刷的感受和一刷截然不同，心里有些酸涩。现在懂你一些了，站在你的角度回看，才明白你那时为什么会觉得我“用力过猛”。对不起呀，那时候的我还不够了解你。
          </p>
          <p>
            我有个能力，当我开始真正了解一个人，就很容易走进她的视角。换位思考这件事我很擅长，却遗憾没能更早用在你身上。
          </p>
          <p>
            我清楚我们俩其实都有点回避。坦诚说，我不知道这是好现象还是坏现象，我只能说出我的感受。有时候，我心里明明攒了好多话想跟你说，话到嘴边却又咽了回去。但这并不妨碍我觉得美好，听你碎碎念着日常，听你分享对事情的看法，我都觉得特别有趣。我们的想法或许不尽相同，但奇妙的是，它们拼凑在一起，却能那么合拍。
          </p>
          <p>
            两个人的相处，总有需要慢慢交心的地方。以后，如果我们遇到需要解开的结，我们就坦诚地告诉对方彼此的感受，好不好？尤其是你，你的每一点小情绪对我来说都很重要，我希望能被你依靠。而那些不需要刻意寻找答案的瞬间，我们就顺其自然，不去评判，就让它们自然而然地发生。
          </p>
          <p>
            我还想对你说，你可以不用把年上当做自己的包袱。有人告诉我们人要懂事，说成年人各有各的辛苦，能互相体谅就该知足。但我不想用这种话搪塞你。我想让你知道，你累的时候，我也想做你的依靠。
          </p>
          <p>100天纪念日快乐，亲爱的老婆。</p>
        </article>
      </div>
    </div>
  )
}

export default RichTextEditorPage
