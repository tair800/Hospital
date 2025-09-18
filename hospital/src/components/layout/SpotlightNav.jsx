import React, { useEffect, useRef } from 'react'
import './SpotlightNav.css'

function SpotlightNav({ items, activeId, onActivate }) {
    const rootRef = useRef(null)

    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        let gsap
        const nav = root.querySelector('nav')
        const links = nav.querySelectorAll('ul.content a')
        const spotlightfePointLight = root.querySelector('#spotlight fePointLight')
        const ambiencefePointLight = root.querySelector('#ambience fePointLight')
        const spotlightfeGaussianBlur = root.querySelector('#spotlight feGaussianBlur')
        const spotlightfeSpecularLighting = root.querySelector('#spotlight feSpecularLighting')
        const ambiencefeGaussianBlur = root.querySelector('#ambience feGaussianBlur')
        const ambiencefeSpecularLighting = root.querySelector('#ambience feSpecularLighting')

        const config = {
            spotlight: { speed: 0.25, deviation: 0.8, surface: 0.5, specular: 6, exponent: 65, light: 'hsla(234, 14%, 72%, 0.25)', x: 0, yOffset: 10, z: 82 },
            ambience: { deviation: 0.8, surface: 0.5, specular: 25, exponent: 65, light: 'hsla(234, 14%, 72%, 0.25)', x: 120, y: -154, z: 160 },
        }

        const update = () => {
            spotlightfeGaussianBlur?.setAttribute('stdDeviation', config.spotlight.deviation)
            spotlightfeSpecularLighting?.setAttribute('surfaceScale', config.spotlight.surface)
            spotlightfeSpecularLighting?.setAttribute('specularConstant', config.spotlight.specular)
            spotlightfeSpecularLighting?.setAttribute('specularExponent', config.spotlight.exponent)
            spotlightfeSpecularLighting?.setAttribute('lighting-color', config.spotlight.light)
            ambiencefeGaussianBlur?.setAttribute('stdDeviation', config.ambience.deviation)
            ambiencefeSpecularLighting?.setAttribute('surfaceScale', config.ambience.surface)
            ambiencefeSpecularLighting?.setAttribute('specularConstant', config.ambience.specular)
            ambiencefeSpecularLighting?.setAttribute('specularExponent', config.ambience.exponent)
            ambiencefeSpecularLighting?.setAttribute('lighting-color', config.ambience.light)

            const anchor = root.querySelector('ul.content [data-active="true"]')
            const navBounds = nav.getBoundingClientRect()
            const anchorBounds = anchor?.getBoundingClientRect()
            if (anchorBounds) {
                const xPos = anchorBounds.left - navBounds.left + anchorBounds.width * 0.5 + config.spotlight.x
                if (gsap) gsap.to(spotlightfePointLight, { duration: config.spotlight.speed, attr: { x: xPos } })
                else spotlightfePointLight?.setAttribute('x', String(xPos))
                const yPos = navBounds.height + config.spotlight.yOffset
                spotlightfePointLight?.setAttribute('y', String(yPos))
                spotlightfePointLight?.setAttribute('z', String(config.spotlight.z))
            }
            ambiencefePointLight?.setAttribute('x', String(config.ambience.x))
            ambiencefePointLight?.setAttribute('y', String(config.ambience.y))
            ambiencefePointLight?.setAttribute('z', String(config.ambience.z))
        }

        const selectAnchor = (anchor) => {
            const navBounds = nav.getBoundingClientRect()
            const anchorBounds = anchor.getBoundingClientRect()
            for (const link of links) link.dataset.active = anchor === link
            const xPos = anchorBounds.left - navBounds.left + anchorBounds.width * 0.5 + config.spotlight.x
            if (gsap) gsap.to(spotlightfePointLight, { duration: config.spotlight.speed, attr: { x: xPos } })
            else spotlightfePointLight?.setAttribute('x', String(xPos))
            const yPos = navBounds.height + config.spotlight.yOffset
            spotlightfePointLight?.setAttribute('y', String(yPos))
        }

        const onClick = (event) => {
            const anchor = event.target?.closest('a')
            if (anchor && nav.contains(anchor)) {
                event.preventDefault()
                const route = anchor.getAttribute('data-route')
                if (route) onActivate?.(route)
                selectAnchor(anchor)
            }
        }

        const init = async () => {
            try {
                const mod = await import('https://cdn.skypack.dev/gsap@3.12.0')
                gsap = mod?.default || mod?.gsap || mod
            } catch (_) { gsap = undefined }
            update()
        }
        init()
        nav.addEventListener('click', onClick)
        return () => nav.removeEventListener('click', onClick)
    }, [activeId])

    return (
        <div ref={rootRef} className="spotlight-nav-root">
            <nav>
                <ul aria-hidden="true" className="lit">
                    {items.map((item) => (<li key={item.id}>{item.label}</li>))}
                </ul>
                <ul className="content">
                    {items.map((item) => (
                        <li key={item.id}>
                            <a data-active={activeId === item.id} data-route={item.href} href={item.href}><span>{item.label}</span></a>
                        </li>
                    ))}
                </ul>
            </nav>
            <svg className="sr-only" aria-hidden="true">
                <filter id="spotlight" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="250%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur>
                    <feSpecularLighting result="lighting" in="blur" surfaceScale="5" specularConstant="0.5" specularExponent="120" lightingColor="#ffffff">
                        <fePointLight x="50" y="50" z="300"></fePointLight>
                    </feSpecularLighting>
                    <feComposite in="lighting" in2="SourceAlpha" operator="in" result="composite"></feComposite>
                    <feComposite in="merged" in2="composite" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"></feComposite>
                </filter>
                <filter id="ambience" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="250%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur>
                    <feSpecularLighting result="lighting" in="blur" surfaceScale="5" specularConstant="0.5" specularExponent="120" lightingColor="#ffffff">
                        <fePointLight x="50" y="50" z="300"></fePointLight>
                    </feSpecularLighting>
                    <feComposite in="lighting" in2="SourceAlpha" operator="in" result="composite"></feComposite>
                    <feComposite in="merged" in2="composite" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint"></feComposite>
                </filter>
            </svg>
        </div>
    )
}

export default SpotlightNav


