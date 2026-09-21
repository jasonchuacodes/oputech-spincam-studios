import { Query, Mutation, Resolver, Args } from '@nestjs/graphql'
import { UseGuards, BadRequestException } from '@nestjs/common'
import { ProductService } from './product.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@UseGuards(JwtAuthGuard)
@Resolver('Product')
export class ProductResolver {
  constructor(private readonly product: ProductService) {}

  @Query()
  products(@Args('search') search?: string) {
    return this.product.findAll(search)
  }

  @Mutation()
  async createProduct(@Args('input') input: CreateProductDto) {
    if (input.imageUrl) {
      this.validateImageUrl(input.imageUrl)
    }
    return this.product.create(input)
  }

  private validateImageUrl(imageUrl: string): void {
    const match = imageUrl.match(
      /^data:image\/[a-zA-Z0-9.+-]+;base64,([A-Za-z0-9+/]+={0,2})$/,
    )
    if (!match || match[1].length % 4 !== 0) {
      throw new BadRequestException('Invalid image format')
    }

    const imageSizeBytes = this.getBase64Size(match[1])
    const maxSizeBytes = 5 * 1024 * 1024

    if (imageSizeBytes > maxSizeBytes) {
      throw new BadRequestException(
        `Image size must be smaller than 5MB (received ${Math.round(imageSizeBytes / (1024 * 1024))}MB)`
      )
    }

    if (imageSizeBytes === 0) {
      throw new BadRequestException('Image size is too small')
    }
  }

  private getBase64Size(base64: string): number {
    const padding = (base64.match(/=/g) || []).length
    return Math.floor((base64.length * 3) / 4) - padding
  }

  @Mutation()
  updateProduct(@Args('id') id: string, @Args('input') input: UpdateProductDto) {
    if (input.imageUrl) {
      this.validateImageUrl(input.imageUrl)
    }
    return this.product.update(id, input)
  }

  @Mutation()
  async deleteProduct(@Args('id') id: string): Promise<boolean> {
    const result = await this.product.remove(id)
    return result !== null
  }
}
