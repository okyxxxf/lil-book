export abstract class Service {
  protected url: string = "";

  public async get() {
    const res = await fetch(this.url);

    return await res.json();
  }

  public async getById(id: number) {
   const res = await fetch(`${this.url}/${id}`); 

   return await res.json();
  }

  public async post(data: any) {
    const res = await fetch(this.url, {
      method: "POST",
      headers : {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: data.login,
        password: data.password,
      }),
    });
    
    return res;
  }

  public async put(id: number, data: any) {
    const res = await fetch(`${this.url}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return await res.json();
  }

  public async delete(id: number) {
    const res = await fetch(`${this.url}/${id}`, {
      method: "DELETE",
    });

    return await res.json();
  }
}