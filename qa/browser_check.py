from pathlib import Path
from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:4173/"
OUT = Path(__file__).resolve().parent / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)


def main() -> None:
    console_errors: list[str] = []
    page_errors: list[str] = []
    rows: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=r"C:\Users\29501\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe",
            headless=True,
        )
        page = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))

        page.goto(BASE_URL, wait_until="domcontentloaded")
        page.wait_for_timeout(250)
        page.screenshot(path=OUT / "01-value-lab.png", full_page=True)

        for number, slide_id in enumerate(("uniqueness", "frontier", "outline", "tactile-content", "map", "pipeline", "fusion", "task-value", "challenge", "future", "future-capability", "future-edge", "future-brain", "future-dynamic", "future-social"), start=2):
            page.goto(BASE_URL + f"#{slide_id}", wait_until="domcontentloaded")
            page.wait_for_timeout(450)
            assert page.url.endswith(f"#{slide_id}"), page.url
            page.screenshot(path=OUT / f"{number:02d}-{slide_id}-lab.png", full_page=True)

        initial_theme = page.locator('.app').get_attribute('class')
        page.keyboard.press("t")
        page.wait_for_timeout(350)
        assert page.locator('.app').get_attribute('class') != initial_theme
        page.screenshot(path=OUT / "05-future-atlas.png", full_page=True)

        page.keyboard.press("e")
        page.wait_for_timeout(250)
        assert page.locator(".evidence-drawer.open").count() == 1
        page.screenshot(path=OUT / "06-evidence-drawer.png", full_page=True)
        page.keyboard.press("Escape")
        assert page.locator(".evidence-drawer.open").count() == 0

        for size in ((1920, 1080), (2560, 1440), (1366, 768)):
            page.set_viewport_size({"width": size[0], "height": size[1]})
            for slide_id in ("value", "uniqueness", "frontier", "outline", "tactile-content", "map", "pipeline", "fusion", "task-value", "challenge", "future", "future-capability", "future-edge", "future-brain", "future-dynamic", "future-social"):
                page.goto(BASE_URL + f"#{slide_id}", wait_until="domcontentloaded")
                page.wait_for_timeout(150)
                metrics = page.evaluate(
                    """() => ({
                      bodyWidth: document.body.scrollWidth,
                      viewportWidth: window.innerWidth,
                      bodyHeight: document.body.scrollHeight,
                      viewportHeight: window.innerHeight,
                      title: document.querySelector('h1')?.textContent,
                    })"""
                )
                assert metrics["bodyWidth"] <= metrics["viewportWidth"], metrics
                assert metrics["bodyHeight"] <= metrics["viewportHeight"], metrics
                geometry = page.evaluate(
                    """() => {
                      const box = selector => {
                        const el = document.querySelector(selector)
                        if (!el) return null
                        const r = el.getBoundingClientRect()
                        return {top:r.top, bottom:r.bottom, left:r.left, right:r.right,
                                scrollHeight:el.scrollHeight, clientHeight:el.clientHeight,
                                scrollWidth:el.scrollWidth, clientWidth:el.clientWidth}
                      }
                      return {
                        heading: box('.slide-heading'),
                        content: box('.value-layout, .unique-layout, .frontier-layout, .outline-layout, .content-layout, .map-toolbar, .pipeline-toolbar, .fusion-layout, .task-value-layout, .challenge-layout, .future-anchor-layout, .future-layout, .future-capability-layout, .future-edge-layout, .future-brain-layout, .future-dynamic-layout, .future-social-layout'),
                        viewport: box('.slide-viewport'),
                        clipped: [...document.querySelectorAll('.contact-visual, .sensor-matrix, .sensor-detail, .nervous-system')]
                          .map(el => ({className:el.className, sh:el.scrollHeight, ch:el.clientHeight, sw:el.scrollWidth, cw:el.clientWidth}))
                      }
                    }"""
                )
                assert geometry["heading"]["bottom"] <= geometry["content"]["top"] + 1, geometry
                assert geometry["content"]["bottom"] <= geometry["viewport"]["bottom"] + 1, geometry
                if slide_id == "future":
                    page.screenshot(
                        path=OUT / f"future-anchor-{size[0]}x{size[1]}.png",
                        full_page=True,
                    )
                if slide_id == "future-capability":
                    page.screenshot(
                        path=OUT / f"future-capability-{size[0]}x{size[1]}.png",
                        full_page=True,
                    )
                if slide_id == "future-edge":
                    steps = page.locator('.edge-roadmap-steps button')
                    assert steps.count() == 4
                    initial_route = page.locator('.edge-roadmap-detail strong').inner_text()
                    steps.nth(1).click()
                    assert steps.nth(1).get_attribute('aria-selected') == 'true'
                    assert page.locator('.edge-roadmap-detail strong').inner_text() != initial_route
                    edge_geometry = page.evaluate(
                        """() => {
                          const rect = selector => {
                            const r = document.querySelector(selector).getBoundingClientRect()
                            return {top:r.top, bottom:r.bottom, left:r.left, right:r.right}
                          }
                          return {
                            card: rect('.edge-roadmap-card'),
                            header: rect('.edge-roadmap-card > header'),
                            roadmap: rect('.edge-roadmap-flow'),
                            contract: rect('.edge-contract'),
                            compression: rect('.edge-compression'),
                          }
                        }"""
                    )
                    assert edge_geometry["header"]["bottom"] <= edge_geometry["roadmap"]["top"] + 1, edge_geometry
                    assert edge_geometry["roadmap"]["bottom"] <= edge_geometry["contract"]["top"] + 1, edge_geometry
                    assert edge_geometry["contract"]["bottom"] <= edge_geometry["compression"]["top"] + 1, edge_geometry
                    assert edge_geometry["compression"]["bottom"] <= edge_geometry["card"]["bottom"] + 1, edge_geometry
                    page.screenshot(
                        path=OUT / f"future-edge-{size[0]}x{size[1]}.png",
                        full_page=True,
                    )
                if slide_id == "future-brain":
                    tabs = page.locator('.future-brain-tabs button')
                    assert tabs.count() == 3
                    initial_title = page.locator('.future-brain-detail h2').inner_text()
                    tabs.nth(1).click()
                    assert tabs.nth(1).get_attribute('aria-selected') == 'true'
                    assert page.locator('.future-brain-detail h2').inner_text() != initial_title
                    assert page.locator('.brain-loop-node').count() == 5
                    page.screenshot(path=OUT / f"future-brain-{size[0]}x{size[1]}.png", full_page=True)
                if slide_id == "future-dynamic":
                    tabs = page.locator('.future-dynamic-tabs button')
                    assert tabs.count() == 3
                    initial_title = page.locator('.future-dynamic-detail h2').inner_text()
                    tabs.nth(1).click()
                    assert tabs.nth(1).get_attribute('aria-selected') == 'true'
                    assert page.locator('.future-dynamic-detail h2').inner_text() != initial_title
                    assert page.locator('.dynamic-signal').count() == 2
                    page.screenshot(path=OUT / f"future-dynamic-{size[0]}x{size[1]}.png", full_page=True)
                if slide_id == "future-social":
                    tabs = page.locator('.future-social-tabs button')
                    assert tabs.count() == 3
                    initial_title = page.locator('.future-social-detail h2').inner_text()
                    tabs.nth(1).click()
                    assert tabs.nth(1).get_attribute('aria-selected') == 'true'
                    assert page.locator('.future-social-detail h2').inner_text() != initial_title
                    assert page.locator('.social-node').count() == 3
                    page.screenshot(path=OUT / f"future-social-{size[0]}x{size[1]}.png", full_page=True)
                # Horizontal scrollWidth is deliberately larger for the clipped
                # decorative circle on sensor-detail, so it is not a collision.
                rows.append(f"{size[0]}x{size[1]} #{slide_id}: {metrics}")

        # The future anchor is an interactive figure, so its own geometry and
        # button semantics need explicit regression coverage beyond page overflow.
        page.set_viewport_size({"width": 1920, "height": 1080})
        page.goto(BASE_URL + "#future", wait_until="domcontentloaded")
        page.wait_for_timeout(200)
        assert page.locator(".future-hotspot").count() == 4
        assert page.locator(".future-flow-static path").count() == 3
        for part in ("brain", "spine", "hand", "contact"):
            hotspot = page.locator(f".hotspot-{part}")
            hotspot.click()
            assert hotspot.get_attribute("aria-pressed") == "true"
            assert page.locator(".future-part-nav button.active").count() == 1
            # Space belongs to a focused native button and must never trigger
            # the global next-slide shortcut.
            hotspot.press("Space")
            assert page.url.endswith("#future"), page.url

        bounds = page.evaluate(
            """() => {
              const v = document.querySelector('.future-anchor-visual').getBoundingClientRect()
              return [...document.querySelectorAll('.future-hotspot')].map(el => {
                const r = el.getBoundingClientRect()
                return {inside:r.left >= v.left && r.right <= v.right && r.top >= v.top && r.bottom <= v.bottom,
                        width:r.width, height:r.height}
              })
            }"""
        )
        assert all(item["inside"] for item in bounds), bounds
        assert all(item["width"] >= 44 and item["height"] >= 44 for item in bounds), bounds

        play = page.locator(".future-play-button")
        play.click()
        assert page.locator(".future-anchor-visual.is-playing").count() == 1
        assert page.locator(".future-flow-live path").count() == 3

        reduced = browser.new_page(viewport={"width": 1920, "height": 1080}, reduced_motion="reduce")
        reduced.goto(BASE_URL + "#future", wait_until="domcontentloaded")
        reduced.wait_for_timeout(150)
        assert reduced.locator(".future-flow-static path").count() == 3
        assert reduced.locator(".future-flow-live").evaluate("el => getComputedStyle(el).display") == "none"
        reduced.close()

        page.goto(BASE_URL + "#future-brain", wait_until="domcontentloaded")
        page.wait_for_timeout(180)
        assert page.locator('.future-brain-tabs button').count() == 3
        assert page.locator('.brain-loop-node').count() == 5

        page.goto(BASE_URL + "#future-dynamic", wait_until="domcontentloaded")
        page.wait_for_timeout(180)
        assert page.locator('.future-dynamic-tabs button').count() == 3
        assert page.locator('.dynamic-signal').count() == 2

        # Task-value slide: function tabs reset the task selection, and task
        # chips reveal the corresponding 3.2.1–3.2.7 detail card.
        page.set_viewport_size({"width": 1920, "height": 1080})
        page.goto(BASE_URL + "#task-value", wait_until="domcontentloaded")
        page.wait_for_timeout(200)
        assert page.locator(".value-function-tabs button").count() == 3
        assert page.locator(".task-cluster button").count() == 2
        initial_card = page.locator(".task-card h4").inner_text()
        page.locator(".task-cluster button").nth(1).click()
        selected_card = page.locator(".task-card h4").inner_text()
        assert initial_card != selected_card
        page.locator(".value-function-tabs button").nth(1).click()
        assert page.locator(".task-cluster button").count() == 4
        assert page.locator(".task-cluster button").nth(0).get_attribute("aria-pressed") == "true"
        reset_card = page.locator(".task-card h4").inner_text()
        assert reset_card != selected_card
        page.locator(".task-cluster button").nth(3).click()
        assert page.locator(".task-cluster button").nth(3).get_attribute("aria-pressed") == "true"
        page.locator(".value-function-tabs button").nth(2).click()
        assert page.locator(".task-cluster button").count() == 1

        # Fusion slide: role and interface tabs expose the two layers of the
        # original 3.1 integration framework.
        page.goto(BASE_URL + "#fusion", wait_until="domcontentloaded")
        page.wait_for_timeout(180)
        assert page.locator(".fusion-role-tabs button").count() == 4
        assert page.locator(".fusion-interface-tabs button").count() == 3
        page.locator(".fusion-role-tabs button").nth(2).click()
        assert page.locator(".fusion-role-tabs button").nth(2).get_attribute("aria-selected") == "true"
        assert "高频" in page.locator(".fusion-touch small").inner_text()
        page.locator(".fusion-interface-tabs button").nth(2).click()
        assert page.locator(".fusion-interface-tabs button").nth(2).get_attribute("aria-selected") == "true"
        assert "并行" in page.locator(".fusion-interface-detail h3").inner_text()

        browser.close()

    if console_errors or page_errors:
        raise RuntimeError(f"console_errors={console_errors}; page_errors={page_errors}")

    print("Browser QA passed")
    print("\n".join(rows))
    print(f"Screenshots: {OUT}")


if __name__ == "__main__":
    main()
