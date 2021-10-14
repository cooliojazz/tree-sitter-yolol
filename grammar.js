module.exports = grammar({
    name: 'YOLOL',

    rules: {
        source_file: $ => repeat($.statement),

        // Literals
        string: $ => /".+"/,
        number: $ => /\d+(?:\.\d{0,3})?/,

        // Data
        identifier: $ => /[A-Za-z]+/,
        variable: $ => $.identifier,
        field: $ => seq(':', $.identifier),

        // Lines
        statement: $ => choice($.conditional, $.goto, $.assignment),
        conditional: $ => seq("if", $.expression, "then", $.statement, optional(seq("else", $.statement)), "end"),
        goto: $ => seq("goto", $.expression),
        expression: $ => choice(choice($.binary_operation, $.unary_operation, $.string, $.number, $.variable, $.field), seq('(', $.expression, ')')),
        binary_operation: $ => prec.left(seq($.expression, $.binary_operator, $.expression)),
        binary_operator: $ => /[+\-*\/%^]|AND|and|OR|or/,
        unary_operation: $ => prec(2, prec.right(choice($.pre_unary_operation, $.post_unary_operation))),
        pre_unary_operation: $ => prec.left(seq($.pre_unary_operator, $.expression)),
        pre_unary_operator: $ => /[-!]|\+\+|--|ABS|NOT|SQRT|SIN|COS|TAN|ASIN|ACOS|ATAN/,
        post_unary_operation: $ => seq($.expression, $.post_unary_operator),
        post_unary_operator: $ => /\+\+|--/,
        assignment: $ => seq(choice($.variable, $.field), /[+\-*\/%\^!]?=[<>=]?/, $.expression),
    }
});
