export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-CL',{
        style:'currency',
        currency:'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatDate(date: Date) {
    return new Intl.DateTimeFormat('es-CL', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date)
}

export function getImagePath(imagePath: string) {
    const cloudinaryBaseUrl = 'https://res.cloudinary.com'
    if(imagePath.startsWith(cloudinaryBaseUrl)){
        return imagePath
    }else{
        return `/products/${imagePath}.jpg`
    }
}
