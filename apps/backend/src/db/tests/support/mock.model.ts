export abstract class MockModel<T> {
  protected abstract entityStub: T

  public constructor(createEntityData: T) {
    this.constructorSpy(createEntityData)
  }

  public constructorSpy(_: T): void {}

  public findOne(): { exec: () => T } {
    return {
      exec: (): T => this.entityStub
    }
  }

  public find(): { exec: () => T[] } {
    return {
      exec: (): T[] => [this.entityStub]
    }
  }

  public async save(): Promise<T> {
    return this.entityStub
  }

  public async findOneAndUpdate(): Promise<T> {
    return this.entityStub
  }

  public async deleteMany(): Promise<{ deletedCount: number }> {
    return { deletedCount: 1 }
  }
}
