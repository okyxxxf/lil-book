var builder = WebApplication.CreateBuilder(args);
string corsName = "MyCors";
// Add services to the container.

builder.Services.AddCors(options => options.AddPolicy(corsName,
    policy =>
    {
        policy
        .AllowAnyOrigin()
        .WithHeaders("Content-Type")
        .WithMethods("PUT", "DELETE");
    }));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(corsName);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
