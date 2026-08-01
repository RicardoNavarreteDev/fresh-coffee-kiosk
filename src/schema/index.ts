import { z } from 'zod'

export const OrderSchema = z.object({
    name: z.string()
        .trim()
        .min(1, 'Tu nombre es obligatorio'),
    total: z.number()
        .min(1, 'Hay errores en la orden'),
    order: z.array(z.object({
        id: z.number(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().int().min(1, 'Cantidad no válida'),
        subtotal: z.number()
    })).min(1, 'Debes agregar al menos un producto')    
        
})

export const OrderIdSchema = z.object({
    orderId: z.string()
            .transform((value) => parseInt(value))
            .refine( value => value > 0, {message: 'Hay errores'})
})

export const SearchSchema = z.object({
    search: z.preprocess(
        value => (typeof value === 'string' ? value.trim() : ''), // Preprocesa null/undefined a ''
        z.string().min(1, { message: 'La búsqueda no puede ir vacía' }) // Valida la cadena
    )
});

export const ProductSchema = z.object({
    name: z.string()
        .trim()
        .min(1, { message: 'El Nombre del Producto no puede ir vacio'}),
    price: z.preprocess(
        value => {
            if (typeof value === 'string') {
                const normalizedValue = value.replace(/[^\d]/g, '')
                return normalizedValue ? parseInt(normalizedValue, 10) : NaN
            }

            return value
        },
        z.number().min(1, { message: 'Precio no válido' })
    ),
    categoryId: z.string()
        .trim()
        .transform((value) => parseInt(value)) 
        .refine((value) => value > 0, { message: 'La Categoría es Obligatoria' })
        .or(z.number().min(1, {message: 'La Categoría es Obligatoria' })),
    stock: z.preprocess(
        value => {
            if (typeof value === 'string') {
                const normalizedValue = value.replace(/[^\d]/g, '')
                return normalizedValue ? parseInt(normalizedValue, 10) : NaN
            }

            return value
        },
        z.number().int().min(0, { message: 'Stock no válido' })
    ),
    description: z.string()
        .trim()
        .min(1, { message: 'La descripción es obligatoria' }),
    image: z.string()
        .trim()
        .min(1, {message: 'La imagen es obligatoria'})
        .refine((value) => {
            const normalizedValue = value.trim().toLowerCase()
            const isLocalSeedImage = /^[a-z0-9_/-]+$/.test(normalizedValue)
            const isAllowedRemoteImage = /^https:\/\/.+\.(jpg|jpeg|webp)(\?.*)?$/.test(normalizedValue)

            return isLocalSeedImage || isAllowedRemoteImage
        }, { message: 'La imagen debe ser JPG, JPEG o WEBP.' })
})
