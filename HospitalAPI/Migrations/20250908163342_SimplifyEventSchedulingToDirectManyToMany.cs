using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalAPI.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyEventSchedulingToDirectManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventScheduleSpeakers");

            migrationBuilder.DropTable(
                name: "Speakers");

            migrationBuilder.CreateTable(
                name: "EventScheduleEmployees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EventScheduleId = table.Column<int>(type: "INTEGER", nullable: false),
                    EmployeeId = table.Column<int>(type: "INTEGER", nullable: true),
                    SpeakerName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    SpeakerPosition = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    SpeakerImage = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Role = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    KeyValue = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventScheduleEmployees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventScheduleEmployees_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_EventScheduleEmployees_EventSchedules_EventScheduleId",
                        column: x => x.EventScheduleId,
                        principalTable: "EventSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventScheduleEmployees_EmployeeId",
                table: "EventScheduleEmployees",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_EventScheduleEmployees_EventScheduleId",
                table: "EventScheduleEmployees",
                column: "EventScheduleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventScheduleEmployees");

            migrationBuilder.CreateTable(
                name: "Speakers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EmployeeId = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    FullName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Image = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    IsExternal = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true),
                    Position = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Speakers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Speakers_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "EventScheduleSpeakers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EventScheduleId = table.Column<int>(type: "INTEGER", nullable: false),
                    SpeakerId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    KeyValue = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Role = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventScheduleSpeakers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventScheduleSpeakers_EventSchedules_EventScheduleId",
                        column: x => x.EventScheduleId,
                        principalTable: "EventSchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventScheduleSpeakers_Speakers_SpeakerId",
                        column: x => x.SpeakerId,
                        principalTable: "Speakers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventScheduleSpeakers_EventScheduleId",
                table: "EventScheduleSpeakers",
                column: "EventScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_EventScheduleSpeakers_SpeakerId",
                table: "EventScheduleSpeakers",
                column: "SpeakerId");

            migrationBuilder.CreateIndex(
                name: "IX_Speakers_EmployeeId",
                table: "Speakers",
                column: "EmployeeId");
        }
    }
}
