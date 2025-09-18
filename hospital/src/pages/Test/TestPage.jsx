import React, { useEffect, useRef, useState } from 'react'

// Local styles for the test page
import './TestPage.css'

function TestPage() {
    const rootRef = useRef(null)
    const [pointerMode, setPointerMode] = useState(false)

    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        // Lighting logic with optional GSAP animation and pointer tracking
        let gsap
        let monitoring = false
        let Pane
        const cleanupFns = []

        // Minimal JS to support spotlight behavior without external panes
        const nav = root.querySelector('nav')
        const links = nav.querySelectorAll('ul.content a')
        const spotlightfePointLight = root.querySelector('#spotlight fePointLight')
        const ambiencefePointLight = root.querySelector('#ambience fePointLight')
        const spotlightfeGaussianBlur = root.querySelector('#spotlight feGaussianBlur')
        const spotlightfeSpecularLighting = root.querySelector('#spotlight feSpecularLighting')
        const ambiencefeGaussianBlur = root.querySelector('#ambience feGaussianBlur')
        const ambiencefeSpecularLighting = root.querySelector('#ambience feSpecularLighting')

        const config = {
            spotlight: {
                speed: 0.25,
                deviation: 0.8,
                surface: 0.5,
                specular: 6,
                exponent: 65,
                light: 'hsla(234, 14%, 72%, 0.25)',
                x: 0,
                yOffset: 10,
                z: 82,
                pointer: pointerMode,
            },
            ambience: {
                deviation: 0.8,
                surface: 0.5,
                specular: 25,
                exponent: 65,
                light: 'hsla(234, 14%, 72%, 0.25)',
                x: 120,
                y: -154,
                z: 160,
            },
        }

        const update = () => {
            // Keep theme scoped to test page root only
            root.setAttribute('data-theme', config.theme)
            spotlightfeGaussianBlur?.setAttribute('stdDeviation', config.spotlight.deviation)
            spotlightfeSpecularLighting?.setAttribute('surfaceScale', config.spotlight.surface)
            spotlightfeSpecularLighting?.setAttribute('specularConstant', config.spotlight.specular)
            spotlightfeSpecularLighting?.setAttribute('specularExponent', config.spotlight.exponent)
            spotlightfeSpecularLighting?.setAttribute('lighting-color', config.spotlight.light)
            // ambience
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
                if (gsap) {
                    gsap.to(spotlightfePointLight, { duration: config.spotlight.speed, attr: { x: xPos } })
                } else {
                    spotlightfePointLight?.setAttribute('x', String(xPos))
                }
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
            if (gsap) {
                gsap.to(spotlightfePointLight, { duration: config.spotlight.speed, attr: { x: xPos } })
            } else {
                spotlightfePointLight?.setAttribute('x', String(xPos))
            }
            const yPos = navBounds.height + config.spotlight.yOffset
            spotlightfePointLight?.setAttribute('y', String(yPos))
        }

        const onClick = (event) => {
            const anchor = event.target?.closest('a')
            if (anchor && nav.contains(anchor)) {
                event.preventDefault()
                const href = anchor.getAttribute('href')
                if (href && href.startsWith('#')) {
                    // Update hash to reflect active section
                    if (window.location.hash !== href) window.location.hash = href
                }
                selectAnchor(anchor)
            }
        }

        const setActiveFromHash = () => {
            const hash = window.location.hash || '#newsletter'
            const anchor = root.querySelector(`ul.content a[href="${hash}"]`)
            if (anchor) {
                for (const link of links) link.dataset.active = link === anchor
                selectAnchor(anchor)
            }
        }

        // Attempt to load GSAP and Tweakpane, then update
        const loadDeps = async () => {
            try {
                const mod = await import('https://cdn.skypack.dev/gsap@3.12.0')
                gsap = mod?.default || mod?.gsap || mod
                const paneMod = await import('https://cdn.skypack.dev/tweakpane@4.0.4')
                Pane = paneMod?.Pane
            } catch (_) {
                gsap = undefined
                Pane = undefined
            } finally {
                update()
            }
        }
        loadDeps()

        nav.addEventListener('click', onClick)
        cleanupFns.push(() => nav.removeEventListener('click', onClick))

        // Sync to current hash on load and changes
        setActiveFromHash()
        window.addEventListener('hashchange', setActiveFromHash)
        cleanupFns.push(() => window.removeEventListener('hashchange', setActiveFromHash))

        const syncLight = ({ x, y }) => {
            if (!config.spotlight.pointer) return
            const navBounds = nav.getBoundingClientRect()
            const xPos = Math.floor(x - navBounds.x)
            if (gsap) {
                gsap.to(spotlightfePointLight, { duration: config.spotlight.speed, attr: { x: xPos } })
            } else {
                spotlightfePointLight?.setAttribute('x', String(xPos))
            }
            const yPos = navBounds.height + config.spotlight.yOffset
            spotlightfePointLight?.setAttribute('y', String(yPos))
        }

        const startPointer = () => {
            if (monitoring) return
            monitoring = true
            root.dataset.pointerLighting = 'true'
            window.addEventListener('pointermove', syncLight)
            cleanupFns.push(() => window.removeEventListener('pointermove', syncLight))
        }
        const stopPointer = () => {
            if (!monitoring) return
            monitoring = false
            root.dataset.pointerLighting = 'false'
            window.removeEventListener('pointermove', syncLight)
        }

        if (config.spotlight.pointer) startPointer()

        // Build Tweakpane controls if available
        const buildPane = () => {
            if (!Pane) return
            const ctrl = new Pane({ title: 'Config', expanded: true })
            const sync = (event) => {
                if (!document.startViewTransition || event?.target?.controller?.view?.labelElement?.innerText !== 'Theme') return update()
                document.startViewTransition(() => update())
            }

            const anchorLight = ctrl.addFolder({ title: 'spotlight', expanded: false })
            anchorLight.addBinding(config.spotlight, 'speed', { min: 0.2, step: 0.1, max: 10, label: 'speed (s)' })
            const blur = anchorLight.addFolder({ title: 'feGaussianBlur' })
            blur.addBinding(config.spotlight, 'deviation', { label: 'stdDeviation', min: 0, max: 10, step: 0.1 })
            const lighting = anchorLight.addFolder({ title: 'feSpecularLighting' })
            lighting.addBinding(config.spotlight, 'light', { label: 'color' })
            lighting.addBinding(config.spotlight, 'surface', { label: 'surfaceScale', min: 0, max: 50, step: 0.1 })
            lighting.addBinding(config.spotlight, 'specular', { label: 'constant', min: 0, max: 25, step: 0.1 })
            lighting.addBinding(config.spotlight, 'exponent', { label: 'exponent', min: 0, max: 200, step: 0.1 })
            const point = anchorLight.addFolder({ title: 'fePointLight' })
            point.addBinding(config.spotlight, 'x', { label: 'x offset', min: -100, max: 100, step: 1 })
            point.addBinding(config.spotlight, 'y', { label: 'y offset', min: -100, max: 100, step: 1 })
            point.addBinding(config.spotlight, 'z', { label: 'z', min: 0, max: 500, step: 1 })
            point.addBinding(config.spotlight, 'pointer', { label: 'pointer' })

            const ambientLight = ctrl.addFolder({ title: 'ambience', expanded: false })
            const ambientblur = ambientLight.addFolder({ title: 'feGaussianBlur' })
            ambientblur.addBinding(config.ambience, 'deviation', { label: 'stdDeviation', min: 0, max: 10, step: 0.1 })
            const ambientlighting = ambientLight.addFolder({ title: 'feSpecularLighting' })
            ambientlighting.addBinding(config.ambience, 'light', { label: 'color' })
            ambientlighting.addBinding(config.ambience, 'surface', { label: 'surfaceScale', min: 0, max: 50, step: 0.1 })
            ambientlighting.addBinding(config.ambience, 'specular', { label: 'constant', min: 0, max: 25, step: 0.1 })
            ambientlighting.addBinding(config.ambience, 'exponent', { label: 'exponent', min: 0, max: 200, step: 0.1 })
            const ambientpoint = ambientLight.addFolder({ title: 'fePointLight' })
            ambientpoint.addBinding(config.ambience, 'x', { label: 'x', min: -500, max: 500, step: 1 })
            ambientpoint.addBinding(config.ambience, 'y', { label: 'y', min: -500, max: 500, step: 1 })
            ambientpoint.addBinding(config.ambience, 'z', { label: 'z', min: 0, max: 500, step: 1 })

            ctrl.addBinding(config, 'theme', { label: 'Theme', options: { System: 'system', Light: 'light', Dark: 'dark' } })
            ctrl.on('change', (ev) => {
                // Keep React state toggle in sync for pointer flag
                if (ev.presetKey === 'spotlight.pointer' || ev?.target?.key === 'pointer') setPointerMode(config.spotlight.pointer)
                sync(ev)
            })
            cleanupFns.push(() => ctrl.dispose?.())
        }
        // Defer building pane slightly to ensure Pane is loaded
        setTimeout(buildPane, 0)

        return () => {
            cleanupFns.forEach((fn) => fn())
            stopPointer()
        }
    }, [pointerMode])

    return (
        <div ref={rootRef} className="test-page-root fluid" data-theme="dark">
            <a className="diamond" href="#" aria-label="diamond">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                    <path d="M480-120 80-600l120-240h560l120 240-400 480Zm-95-520h190l-60-120h-70l-60 120Zm55 347v-267H218l222 267Zm80 0 222-267H520v267Zm144-347h106l-60-120H604l60 120Zm-474 0h106l60-120H250l-60 120Z" />
                </svg>
            </a>
            <nav>
                <ul aria-hidden="true" className="lit">
                    <li>Newsletter</li>
                    <li>Course</li>
                    <li>Pricing</li>
                    <li>Subscribe</li>
                </ul>
                <ul className="content">
                    <li>
                        <a data-active="true" href="#newsletter"><span>Newsletter</span></a>
                    </li>
                    <li>
                        <a href="#product"><span>Course</span></a>
                    </li>
                    <li>
                        <a href="#price"><span>Pricing</span></a>
                    </li>
                    <li>
                        <a href="#subscribe"><span>Subscribe</span></a>
                    </li>
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
            <a className="bear-link" href="https://twitter.com/intent/follow?screen_name=jh3yy" target="_blank" rel="noreferrer noopener" aria-label="bear link">
                <svg className="w-9" viewBox="0 0 969 955" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="161.191" cy="320.191" r="133.191" stroke="currentColor" strokeWidth="20"></circle>
                    <circle cx="806.809" cy="320.191" r="133.191" stroke="currentColor" strokeWidth="20"></circle>
                    <circle cx="695.019" cy="587.733" r="31.4016" fill="currentColor"></circle>
                    <circle cx="272.981" cy="587.733" r="31.4016" fill="currentColor"></circle>
                    <path d="M564.388 712.083C564.388 743.994 526.035 779.911 483.372 779.911C440.709 779.911 402.356 743.994 402.356 712.083C402.356 680.173 440.709 664.353 483.372 664.353C526.035 664.353 564.388 680.173 564.388 712.083Z" fill="currentColor"></path>
                    <rect x="310.42" y="448.31" width="343.468" height="51.4986" fill="#FF1E1E"></rect>
                    <path fillRule="evenodd" clipRule="evenodd" d="M745.643 288.24C815.368 344.185 854.539 432.623 854.539 511.741H614.938V454.652C614.938 433.113 597.477 415.652 575.938 415.652H388.37C366.831 415.652 349.37 433.113 349.37 454.652V511.741L110.949 511.741C110.949 432.623 150.12 344.185 219.845 288.24C289.57 232.295 384.138 200.865 482.744 200.865C581.35 200.865 675.918 232.295 745.643 288.24Z" fill="currentColor"></path>
                </svg>
            </a>
            <button
                type="button"
                onClick={() => setPointerMode((v) => !v)}
                style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 10 }}
            >
                {pointerMode ? 'Pointer: ON' : 'Pointer: OFF'}
            </button>
        </div>
    )
}

export default TestPage


