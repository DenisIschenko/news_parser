import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

function CategorySelect({ categories, selectedCategory, onChange }) {
    return (
        <FormControl fullWidth sx={{ maxWidth: 300, mb: 3 }}>
            <InputLabel id="category-label">Фільтр за категорією</InputLabel>
            <Select
                labelId="category-label"
                value={selectedCategory}
                label="Фільтр за категорією"
                onChange={onChange}
            >
                <MenuItem value="">Всі категорії</MenuItem>
                {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default CategorySelect