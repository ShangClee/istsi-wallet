import React from "react"

export interface CarouselProps {
  children: React.ReactNode[]
  current: number
}

/**
 * IMPORTANT:
 * You must NOT use the `autoFocus` prop in children of the Carousel as this
 * might cause the Carousel to get stuck in an invalid scroll position (see
 * https://github.com/satoshipay/solar/issues/1069)
 */
function Carousel(props: CarouselProps) {
  return (
    <div className="block h-full overflow-auto w-full">
      <div className="flex h-full justify-start overflow-x-hidden overflow-y-auto">
        {props.children.map((content, index) => (
          <div
            key={index}
            className={`flex-[0_0_100%] overflow-auto transition-all duration-300 will-change-[opacity,transform] ${
              index === props.current ? "opacity-100" : "opacity-50"
            }`}
            style={{
              transform: `translateX(${-100 * props.current}%)`
            }}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(Carousel)
