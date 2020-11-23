import '@testing-library/jest-dom/extend-expect'
window.scrollTo = (x, y) => {
    document.documentElement.scrollTop = y
}